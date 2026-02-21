import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const authToken = authService.getToken();
  if(authToken){
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization',`Bearer ${authToken}`),
    })
    return next(clonedReq);
  }
  return next(req);
};
