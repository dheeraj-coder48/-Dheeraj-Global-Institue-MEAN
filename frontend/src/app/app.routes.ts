import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Admission } from './features/admission/admission';
import { Events } from './features/events/events';
import { Gallery } from './features/gallery/gallery';
import { Notices } from './features/notices/notices';
import { Teachers } from './features/teachers/teachers';
import { Contact } from './pages/contact/contact';
import { About } from './pages/about/about';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { Disclaimer } from './pages/disclaimer/disclaimer';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { authGuard } from './guards/auth-guard';
import { LostFoundComponent } from './features/lost-found/lost-found.component';
import { AlumniComponent } from './features/alumni/alumni.component';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'admission', component: Admission },
    { path: 'events', component: Events },
    { path: 'gallery', component: Gallery },
    { path: 'notices', component: Notices },
    { path: 'teachers', component: Teachers },
    { path: 'contact-us', component: Contact },
    { path: 'about-us', component: About },
    { path: 'privacy-policy', component: PrivacyPolicy },
    { path: 'disclaimer', component: Disclaimer },
    { path: 'lost-found', component: LostFoundComponent }, // ADD THIS NEW ROUTE
    { path: 'alumni', component: AlumniComponent },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '/home' }
];