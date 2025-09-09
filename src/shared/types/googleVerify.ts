  export type GoogleVerify = {
    success: boolean;
    'error-codes'?: string[];
    score?: number;
    action?: string;
    challenge_ts?: string;
    hostname?: string;
  };
