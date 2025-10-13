export interface JwtResponse {
  user: JwtPayload;
  token: string;
}

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
}
