'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const isAuth = (WrappedComponent) => {
	const ProtectRoute = (props) => {
		const router = useRouter();
		const pathname = usePathname();

		const token = Cookies.get('accessToken');
		const role = Cookies.get('role');
		const isAuthenticated = !!token;

		useEffect(() => {
			if (!isAuthenticated) {
				router.push('/');
			} else if (role) {
				router.push(`/${role}/proposal/route-1`);
			} else {
				router.push(pathname);
			}
		}, [isAuthenticated, role, pathname, router]);

		return <WrappedComponent {...props} />;
	};

	ProtectRoute.displayName = `isAuth(${
		WrappedComponent.displayName || WrappedComponent.name || 'Component'
	})`;

	return ProtectRoute;
};

export default isAuth;
