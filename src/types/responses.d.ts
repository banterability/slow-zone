type RouteId = "Red" | "Blue" | "Brn" | "G" | "Org" | "P" | "Pink" | "Y";

type TrainDirection = "1" | "5";

type BooleanNumber = "0" | "1";

export type APIResponse = {
  ctatt: {
    tmst: string;
    errCd: string;
    errNm: string;
    position?: {
      lat: string;
      lon: string;
      heading: string;
    };
    eta: TrainResponse[];
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
  isApp: BooleanNumber;
  isSch: BooleanNumber;
  isDly: BooleanNumber;
  isFlt: BooleanNumber;
  flags: string;
  lat?: string;
  lon?: string;
  heading?: string;
};
