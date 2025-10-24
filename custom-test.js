(function() {
    'use strict';

    document.getElementById('custom-burger-menu')?.remove();
    document.getElementById('custom-dropdown-menu')?.remove();

    const BURGER_STYLE = {
        width: '24px',
        height: '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: '1000',
        position: 'relative',
        margin: '2px',
        padding: '4px',
    };

    const LINE_STYLE = {
        width: '85%',
        height: '2px',
        backgroundColor: 'grey',
    };

    const MENU_STYLE = {
        position: 'fixed',
        backgroundColor: '#2f3136',
        border: '1px solid #202225',
        borderRadius: '8px',
        minWidth: '200px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.24)',
        display: 'none',
        flexDirection: 'column',
        zIndex: '999999',
        padding: '8px 0',
        transform: 'translateX(calc(-50% + 15px))',
    };

    const MENU_ITEM_STYLE = {
        padding: '10px 16px',
        cursor: 'pointer',
        color: '#dcddde',
        fontSize: '14px',
        transition: 'background-color 0.15s ease',
        userSelect: 'none',
        zIndex: '10000',
    };

    class BurgerMenu {
        constructor() {
            this.burger = null;
            this.menu = null;
            this.observer = null;
            this.retryCount = 0;
            this.maxRetries = 20;
            this.inserted = false;
        }

        createBurger() {
            const burger = document.createElement('div');
            burger.id = 'custom-burger-menu';
            Object.assign(burger.style, BURGER_STYLE);

            for (let i = 0; i < 3; i++) {
                const line = document.createElement('span');
                Object.assign(line.style, LINE_STYLE);
                burger.appendChild(line);
            }
            return burger;
        }

        createMenu() {
            const menu = document.createElement('div');
            menu.id = 'custom-dropdown-menu';
            Object.assign(menu.style, MENU_STYLE);

            const menuItems = [
                { label: 'Accueil', action: 'home' },
                { label: 'Paramètres', action: 'settings' },
                { label: 'À propos', action: 'about' }
            ];

            menuItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.textContent = item.label;
                Object.assign(menuItem.style, MENU_ITEM_STYLE);

                menuItem.addEventListener('mouseenter', () => {
                    menuItem.style.backgroundColor = '#3c3f45';
                });
                menuItem.addEventListener('mouseleave', () => {
                    menuItem.style.backgroundColor = 'transparent';
                });

                menuItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.style.display = 'none';
                    
                    if (item.action === 'home') {
                        this.showCustomHome();
                    }
                });

                menu.appendChild(menuItem);
            });

            document.body.appendChild(menu);
            return menu;
        }

        showCustomHome() {
            const pageContainer = document.querySelector('[class*="page_c48ade"]');
            if (!pageContainer) return;

            const pageChild = pageContainer.children[0];
            if (!pageChild) return;

            pageChild.innerHTML = '';

            const customPage = document.createElement('div');
            customPage.id = 'custom-home-page';
            customPage.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 100%;
                background: linear-gradient(135deg, #2f3136 0%, #36393f 100%);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                color: #dcddde;
            `;

            const content = document.createElement('div');
            content.style.cssText = `
                text-align: center;
                font-size: 48px;
                font-weight: 600;
                letter-spacing: 1px;
            `;
            content.textContent = 'Bonjour';

            customPage.appendChild(content);
            pageChild.appendChild(customPage);
        }

        attachBurgerEvents() {
            this.burger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = this.menu.style.display === 'flex';

                if (!isVisible) {
                    const rect = this.burger.getBoundingClientRect();
                    this.menu.style.top = `${rect.bottom + 4}px`;
                    this.menu.style.left = `${rect.left}px`;
                    this.menu.style.display = 'flex';
                } else {
                    this.menu.style.display = 'none';
                }
            });

            document.addEventListener('click', (e) => {
                if (!this.burger.contains(e.target) && !this.menu.contains(e.target)) {
                    this.menu.style.display = 'none';
                }
            });
        }

        findTarget() {
            let container = document.querySelector('[class*="container__37e49"]');
            if (!container || container.offsetParent === null) {
                return null;
            }

            let elements = document.querySelectorAll('[class*="trailing_c38106"]');
            let target = elements[0];
            for (const el of elements) {
                if (el.offsetParent !== null) {
                    target = el;
                    return target;
                }
            }
            return null;
        }

        insert() {
            if (this.inserted || document.getElementById('custom-burger-menu')) {
                return true;
            }

            const target = this.findTarget();
            if (!target) {
                return false;
            }

            this.burger = this.createBurger();
            this.menu = this.createMenu();
            this.attachBurgerEvents();

            if (target.firstChild) {
                target.insertBefore(this.burger, target.firstChild);
            } else {
                target.appendChild(this.burger);
            }

            this.inserted = true;
            if (this.observer) {
                this.observer.disconnect();
            }
            return true;
        }

        tryInsert() {
            if (this.insert()) return true;
            this.retryCount++;
            if (this.retryCount < this.maxRetries) {
                setTimeout(() => this.tryInsert(), 1000);
                return false;
            }
            return false;
        }

        startObserver() {
            this.observer = new MutationObserver(() => {
                if (!this.inserted && !document.getElementById('custom-burger-menu')) {
                    this.insert();
                }
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    window.burgerMenu = new BurgerMenu();
    setTimeout(() => window.burgerMenu.tryInsert(), 2000);
    setTimeout(() => window.burgerMenu.startObserver(), 1000);
})();
