export interface CreateResourceDto { method: string; path: string; description?: string; }
export interface ResourceResponseDto { id: string; method: string; path: string; description?: string; createdAt?: Date; }
