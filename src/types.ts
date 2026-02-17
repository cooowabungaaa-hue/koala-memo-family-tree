export interface KoalaCSV {
  id: string;
  name: string;
  gender: string;
  birthday: string;
  age: string;
  mother: string;
  mother_id: string;
  father: string;
  father_id: string;
  zoo: string;
  death: string;
  memo: string;
}

export interface Koala extends KoalaCSV {
  isAlive: boolean;
  children: string[]; // IDs of children
}

export interface KoalaNode {
  id: string;
  data: Koala;
  mother?: KoalaNode;
  father?: KoalaNode;
  children: KoalaNode[];
}
