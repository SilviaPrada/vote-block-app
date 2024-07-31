export type ChartData = {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

export type PieChartComponentProps = {
  data: ChartData[];
};

export interface BigNumberType {
  type: string;
  hex: string;
}

export interface Candidate {
  candidate_id: string;
  elections: string;
  name: string;
  vision: string;
  mission: string;
  voteCount: BigNumberType;
}

export interface ElectionContextProps {
  candidates: Candidate[];
  updateCandidates: () => Promise<void>;
}

export type CandidateHistory = [
  BigNumberType, // id
  string,       // name
  string,       // visi
  string,       // misi
  BigNumberType  // lastUpdated
];

export type Voter = {
  elections: string[];
  email: string;
  name: string;
  password: string;
  voter_id: string;
};

export interface VoteCount {
  id: BigNumberType;
  voteCount: BigNumberType;
}

export interface VoteHistory {
  idElection: BigNumberType;
  idCandidate: BigNumberType;
  idVoter: BigNumberType;
  voteCount: BigNumberType;
  timestamp: BigNumberType;
  transactionHash: BigNumberType;
  blockNumber: BigNumberType;
}

export type VoterHistory = [
  BigNumberType, // id
  string,        // name
  string,        // email
  boolean,       // hasVoted
  string,        // txHash
  BigNumberType  // lastUpdated
];
