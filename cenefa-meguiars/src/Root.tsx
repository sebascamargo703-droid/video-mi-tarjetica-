import React from "react";
import { Still } from "remotion";
import { Cenefa, SIZE } from "./Cenefa";
import "./fonts";

export const RemotionRoot: React.FC = () => <Still id="Cenefa" component={Cenefa} width={SIZE.w} height={SIZE.h} />;
