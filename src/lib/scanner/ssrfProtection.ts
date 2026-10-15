import dns from "dns/promises";
import net from "net";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecurityError";
  }
}

/**
 * Checks if an IPv4 address is in a reserved, private, loopback, or metadata range.
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // malformed, treat as unsafe
  }

  const [a, b] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 10.0.0.0/8 (Private Class A)
  if (a === 10) return true;

  // 172.16.0.0/12 (Private Class B: 172.16.0.0 - 172.31.255.255)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (Private Class C)
  if (a === 192 && b === 168) return true;

  // 169.254.0.0/16 (Link-Local & Cloud Metadata Service, e.g. AWS 169.254.169.254)
  if (a === 169 && b === 254) return true;

  // 100.64.0.0/10 (Shared address space / Carrier Grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;

  // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
  if (a >= 224) return true;

  return false;
}

/**
 * Checks if an IPv6 address is private, loopback, or unique local.
 */
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === "::1" || normalized === "::") return true;

  // Unique local addresses (fc00::/7)
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

  // Link-local addresses (fe80::/10)
  if (normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) {
    return true;
  }

  // IPv4-mapped IPv6 (::ffff:127.0.0.1, etc.)
  if (normalized.startsWith("::ffff:")) {
    const ipv4Part = normalized.substring(7);
    if (net.isIPv4(ipv4Part)) {
      return isPrivateIPv4(ipv4Part);
    }
  }

  return false;
}

/**
 * Validates a target URL against SSRF attacks and protocol constraints.
 * Allows safe civic test fixtures on localhost:3000 if explicitly accessing /test-fixture.
 */
export async function validateTargetUrl(rawUrl: string): Promise<URL> {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    throw new ValidationError("URL cannot be empty.");
  }

  let formatted = trimmed;
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = "https://" + formatted;
  }

  let parsed: URL;
  try {
    parsed = new URL(formatted);
  } catch {
    throw new ValidationError("Malformed URL. Please enter a valid web address.");
  }

  // 1. Protocol validation: Only HTTP and HTTPS
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new SecurityError(`Invalid protocol "${parsed.protocol}". Only HTTP and HTTPS are permitted.`);
  }

  const hostname = parsed.hostname.toLowerCase();

  // Allow internal test fixture for demonstration purposes
  const isInternalTestFixture =
    (hostname === "localhost" || hostname === "127.0.0.1") &&
    parsed.pathname.startsWith("/test-fixture");

  if (isInternalTestFixture) {
    return parsed;
  }

  // 2. Reject obvious private hostnames
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".lan") ||
    hostname === "0.0.0.0"
  ) {
    throw new SecurityError("Scanning local or private internal hostnames is prohibited.");
  }

  // 3. DNS Lookup & IP validation (SSRF Protection)
  if (net.isIP(hostname)) {
    // Direct IP address provided in URL
    if (net.isIPv4(hostname) && isPrivateIPv4(hostname)) {
      throw new SecurityError("Scanning private, loopback, or metadata IP ranges is prohibited.");
    }
    if (net.isIPv6(hostname) && isPrivateIPv6(hostname)) {
      throw new SecurityError("Scanning private or loopback IPv6 addresses is prohibited.");
    }
  } else {
    // Resolve hostname to all addresses
    try {
      const addresses = await dns.lookup(hostname, { all: true });
      if (!addresses || addresses.length === 0) {
        throw new ValidationError(`Unable to resolve domain "${hostname}". Check spelling or network connectivity.`);
      }

      for (const addr of addresses) {
        if (addr.family === 4 && isPrivateIPv4(addr.address)) {
          throw new SecurityError(`Domain "${hostname}" resolves to private IP address ${addr.address}. Request blocked.`);
        }
        if (addr.family === 6 && isPrivateIPv6(addr.address)) {
          throw new SecurityError(`Domain "${hostname}" resolves to internal IPv6 address ${addr.address}. Request blocked.`);
        }
      }
    } catch (err: unknown) {
      if (err instanceof SecurityError || err instanceof ValidationError) {
        throw err;
      }
      const msg = err instanceof Error ? err.message : String(err);
      throw new ValidationError(`DNS lookup failed for "${hostname}": ${msg}`);
    }
  }

  return parsed;
}

/**
 * Safely fetches target HTML with SSRF checks on redirects, timeout protection,
 * and response size caps.
 */
export async function safeFetchHtml(
  targetUrl: string,
  options: { timeoutMs?: number; maxRedirects?: number } = {}
): Promise<{ html: string; finalUrl: string }> {
  const timeoutMs = options.timeoutMs ?? 10000;
  const maxRedirects = options.maxRedirects ?? 3;

  let currentUrl = targetUrl;
  let redirectsCount = 0;

  while (redirectsCount <= maxRedirects) {
    const validated = await validateTargetUrl(currentUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(validated.toString(), {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (compatible; AccessAbleAI/1.0)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        throw new ValidationError(`Connection timed out after ${timeoutMs / 1000}s while fetching "${currentUrl}".`);
      }
      throw new ValidationError(`Failed to connect to "${currentUrl}": ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      clearTimeout(timeoutId);
    }

    // Handle redirects manually to validate each target IP
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) {
        throw new ValidationError(`Redirect response (${response.status}) received without Location header.`);
      }

      redirectsCount++;
      if (redirectsCount > maxRedirects) {
        throw new SecurityError(`Exceeded maximum allowed redirects (${maxRedirects}).`);
      }

      currentUrl = new URL(location, validated).toString();
      continue;
    }

    if (!response.ok) {
      throw new ValidationError(`Remote server responded with HTTP status ${response.status} (${response.statusText}).`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new ValidationError(`Target URL returned content type "${contentType}", but HTML was expected.`);
    }

    // Max 5MB payload protection
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > 5 * 1024 * 1024) {
      throw new ValidationError("Page content exceeds the 5MB size limit.");
    }

    const decoder = new TextDecoder("utf-8");
    const html = decoder.decode(buffer);

    return {
      html,
      finalUrl: validated.toString(),
    };
  }

  throw new SecurityError("Too many redirects.");
}
