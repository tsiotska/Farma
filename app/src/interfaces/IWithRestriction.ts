export interface IWithRestriction {
    // farmPermissions?: Map<number, string[]>; // userStore
    // companyPermissions?: Map<number, string[]>; // userStore
    // currentFarm?: number; // farmsStore
    // currentCompany?: number; // userStore
    isAllowed?: boolean; // prop passed from withRestriction decorator
}
