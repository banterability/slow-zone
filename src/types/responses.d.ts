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
  rt: string;
  destSt: string;
  destNm: string;
  trDr: string;
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
