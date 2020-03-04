import * as React from 'react';
import { render } from 'react-dom';
import { lazy, Suspense } from 'react';
import LoadingMask from './src/components/LoadingMask';

const App = lazy(() => import(/* webpackChunkName: 'App' */'./src/containers/App'));

const AppCmp = () => (
    <Suspense fallback={<LoadingMask />}>
        <App />
    </Suspense>
);
render(<AppCmp />, document.getElementById('app'));
