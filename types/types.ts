export type AddStackParamList = {
    Settings: undefined;
    NumberDisplay: {
      digit: string;
      rows: string;
      time: string;
      speak: boolean;
      changeColor: boolean;
    };
    Answer: {
      sum: number;
      digit: string;
      rows: string;
      time: string;
      speak: boolean;
      changeColor: boolean;
    };
  };

  export type SubtractStackParamList = {
    SubtractSettings: undefined;
    SubtractNumberDisplay: {
      digit: string;
      rows: string;
      time: string;
      speak: boolean;
      changeColor: boolean;
    };
    SubtractAnswer: {
      sum: number;
      digit: string;
      rows: string;
      time: string;
      speak: boolean;
      changeColor: boolean;
    };
  };

  export type MulRootStackParamList = {
    Home: undefined;
    Multiplication: { questions: number; time: number; multiplier: number; multiplied: number };
  };

  export type DivRootStackParamList = {
    Home: undefined;
    Division: {
      questions: number;
      time: number;
      dividendDigits: number;
      divisorDigits: number;
    };
  };
  