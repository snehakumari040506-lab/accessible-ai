"use client";

import React from "react";
import RobotMascot3D from "./RobotMascot3D";

/**
 * MascotPlaceholder:
 * Forwards seamlessly to RobotMascot3D for backward compatibility and clean modularity.
 */
export default function MascotPlaceholder() {
  return <RobotMascot3D />;
}
