import React, {Component, ComponentType} from 'react';
import {IWithRestriction} from '../../interfaces';
import {inject, observer} from 'mobx-react';

// origin
// export function withRestriction(props: any): <P extends object> (WrappedComponent: ComponentType<P>) => void {
//     return <P extends object>(WrappedComponent: ComponentType<P>) =>
//         class Restricted extends Component<P> {
//         public render() {
//             return <div>
//                 <WrappedComponent {...this.props}/>
//             </div>;
//         }
//     };
// }

export function withRestriction(permissions: string[]):
    <P extends IWithRestriction> (WrappedComponent: ComponentType<P>) => void {
    return <P extends IWithRestriction>(WrappedComponent: ComponentType<P>) => {
        @inject(({
             appState: {
                 userStore: {
                     companyPermissions,
                     farmPermissions,
                     currentCompany,
                 },
                 farmsStore: {
                     currentFarm
                 }
             }
                }) => ({
            companyPermissions,
            farmPermissions,
            currentFarm,
            currentCompany
        }))
        @observer
         class RestrictedComponent extends Component<P> {
            public render() {
                // const {
                //     companyPermissions,
                //     farmPermissions,
                //     currentCompany,
                //     currentFarm
                // } = this.props;
                //
                // const currentFarmPermissions = farmPermissions.get(currentFarm) || [];
                // const currentCompanyPermissions = companyPermissions.get(currentCompany) || [];
                //
                // const allowedByFarms = permissions.some(permission => currentFarmPermissions.includes(permission));
                // const allowedByCompanies = permissions.some(permission => currentCompanyPermissions.includes(permission));

                return <WrappedComponent
                    {...this.props}
                    isAllowed={true}
                />;
            }
         }

        return RestrictedComponent;
    };
}
