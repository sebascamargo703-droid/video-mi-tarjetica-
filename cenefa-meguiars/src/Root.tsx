import React from "react";
import { Still } from "remotion";
import { Cenefa, SIZE } from "./Cenefa";
import { CenefaVenta } from "./CenefaVenta";
import { CenefaLogo } from "./CenefaLogo";
import { CenefaProductos } from "./CenefaProductos";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    <Still id="Cenefa" component={Cenefa} width={SIZE.w} height={SIZE.h} />
    <Still id="CenefaVenta" component={CenefaVenta} width={SIZE.w} height={SIZE.h} />
    <Still id="CenefaLogo" component={CenefaLogo} width={SIZE.w} height={SIZE.h} />
    <Still id="CenefaProductos" component={CenefaProductos} width={SIZE.w} height={SIZE.h} />
  </>
);
