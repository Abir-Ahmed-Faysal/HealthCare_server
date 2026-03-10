interface IAdminFilterRequest {
  id: string;
}

interface IAdminUpdatePayload {
  name: string
  profilePhoto: string
  contactNumber: string
}

export type { IAdminFilterRequest, IAdminUpdatePayload };