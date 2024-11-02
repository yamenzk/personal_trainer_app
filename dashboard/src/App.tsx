import { FrappeProvider } from 'frappe-react-sdk'
import { ThemeProvider } from './providers/ThemeProvider';
import { WizardProvider } from './providers/WizardProvider';
import { AuthProvider } from './components/auth/AuthProvider';
import { AppRouter } from './router';
import { Toaster } from 'sonner';

function App() {

	const getSiteName = () => {
		// @ts-ignore
		if (window.frappe?.boot?.versions?.frappe && (window.frappe.boot.versions.frappe.startsWith('15') || window.frappe.boot.versions.frappe.startsWith('16'))) {
			// @ts-ignore
			return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME
		}
		return import.meta.env.VITE_SITE_NAME

	}


	return (
		<FrappeProvider
		socketPort={import.meta.env.VITE_SOCKET_PORT ?? '9000'}
		siteName={getSiteName()}
		>
		<ThemeProvider>
		  <WizardProvider>
			<AuthProvider>
			  <AppRouter />
			  <Toaster />
			</AuthProvider>
		  </WizardProvider>
		</ThemeProvider>
		</FrappeProvider>
	  );
}

export default App
