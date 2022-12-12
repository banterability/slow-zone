type TrainDirection = "1" | "5";

type RouteId = "Red" | "Blue" | "Brn" | "G" | "Org" | "P" | "Pink" | "Y";

export type CTAResponse = {
  ctatt: {
    tmst: string;
    errCd: string;
    errNm: string;
    position?: {
      lat: string;
      lon: string;
      heading: string;
    };
    eta: [TrainResponse];
  };
};

export type TrainResponse = {
  staId: string;
  stpId: string;
  staNm: string;
  stpDe: string;
  rn: string;
  rt: RouteId;
  destSt: string;
  destNm: string;
  trDr: TrainDirection;
  prdt: string;
  arrT: string;
  isApp: string;
  isSch: string;
  isDly: string;
  isFlt: string;
  flags: string;
  lat: string;
  lon: string;
  heading: string;
};
