export interface CreateUserDto { name: string; email: string; password: string; is_active?: boolean; }
export interface UpdateUserDto { name?: string; email?: string; password?: string; is_active?: boolean; }
export interface ChangePasswordDto { current_password: string; new_password: string; }
export interface UserResponseDto { id: string; name: string; email: string; is_active: boolean; roles?: string[]; createdAt?: Date; updatedAt?: Date; }
