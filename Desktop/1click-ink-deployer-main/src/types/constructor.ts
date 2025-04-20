export interface ConstructorArg {
    label: string;
    type: {
      displayName: string[];
      type?: string;
    };
  }
  
  export interface Constructor {
    label: string;
    args: ConstructorArg[];
  }
  