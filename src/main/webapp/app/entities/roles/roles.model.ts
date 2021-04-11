export interface IRoles {
  id?: number;
  role?: string;
}

export class Roles implements IRoles {
  constructor(public id?: number, public role?: string) {}
}

export function getRolesIdentifier(roles: IRoles): number | undefined {
  return roles.id;
}
