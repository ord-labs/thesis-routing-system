'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const isAuth = (WrappedComponent) => {
	const ProtectRoute = (props) => {
		const router = useRouter();
		const pathname = usePathname();

		let isAuthenticated = false;
		const token = Cookies.get('accessToken');
		const role = Cookies.get('role');

		if (token) {
			isAuthenticated = true;
		}

		useEffect(() => {
			if (!isAuthenticated) {
				router.push('/');
			} else if (token && role !== undefined) {
				if (pathname.split('/').length < 3) {
					router.push(`/${role}/proposal/route-1`);
				} else {
					router.push(`${pathname}`);
				}
			}
		}, [isAuthenticated]);

		return <WrappedComponent {...props} />;
	};

	ProtectRoute.displayName = `isAuth(${
		WrappedComponent.displayName || WrappedComponent.name
	})`;

	return ProtectRoute;
};

export default isAuth;
