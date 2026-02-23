export interface RegisterUserDto {
    firstName: string;
    middleName?: string | null;
    lastName: string;
    email: string;
    countryCode?: string | null;
    mobileNumber?: string | null;
    password: string;
}

