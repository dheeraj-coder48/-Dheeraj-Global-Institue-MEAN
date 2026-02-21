import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  isMenuOpen = false;
  isDropdownOpen = false;
  scrollProgress = 0;
  constructor(private authService :Auth){}
  logOut(){
    this.authService.logOut();
    this.closeMenu();
  }
  isLoggedIn(){
    return this.authService.isLoggedIn();
  }
    toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

    toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.isDropdownOpen = false;
    document.body.style.overflow = 'auto';
  }



   @HostListener('window:scroll')
  onWindowScroll() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.scrollProgress = (winScroll / height) * 100;
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
}
