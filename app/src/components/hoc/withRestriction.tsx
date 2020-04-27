import React, {Component, ComponentType} from 'react';
import {IWithRestriction} from '../../interfaces';
import {inject, observer} from 'mobx-react';
import { PERMISSIONS } from '../../constants/Permissions';

export function withRestriction(permissions: PERMISSIONS[]):
    <P extends IWithRestriction> (WrappedComponent: ComponentType<P>) => void {
    return <P extends IWithRestriction>(WrappedComponent: ComponentType<P>) => {
        @inject(({
            appState: {
                userStore: {
                    user
                },
                departmentsStore: {
                    positions
                }
            }
            }) => ({
                user,
                positions
        }))
        @observer
         class RestrictedComponent extends Component<P> {
            public render() {
                const {
                    user,
                    positions
                } = this.props;

                const pos = user
                ? positions.get(user.position)
                : null;

                const rolePermissions = pos
                ? pos.permissions
                : [];

                const isAllowed = permissions.every(x => rolePermissions.includes(x));

                return <WrappedComponent
                    {...this.props}
                    isAllowed={isAllowed}
                />;
            }
         }

        return RestrictedComponent;
    };
}
