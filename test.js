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

    const elements = document.querySelectorAll('[class*="trailing_c38106"]');

    let target = elements[0];
    for (const el of elements) {
        if (el.offsetParent !== null) {
            target = el;
            break;
        }
    }

    const burger = document.createElement('div');
    burger.id = 'custom-burger-menu';
    Object.assign(burger.style, BURGER_STYLE);

    for (let i = 0; i < 3; i++) {
        const line = document.createElement('span');
        Object.assign(line.style, LINE_STYLE);
        burger.appendChild(line);
    }

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

        // Hover effect
        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.backgroundColor = '#3c3f45';
        });
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.backgroundColor = 'transparent';
        });

        // Click handler
        menuItem.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.style.display = 'none';
        });

        menu.appendChild(menuItem);
    });

    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = menu.style.display === 'flex';

        if (!isVisible) {
            const rect = burger.getBoundingClientRect();
            menu.style.top = `${rect.bottom + 4}px`;
            menu.style.left = `${rect.left}px`;
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!burger.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    document.body.appendChild(menu);

    if (target.firstChild) {
        target.insertBefore(burger, target.firstChild);
    } else {
        target.appendChild(burger);
    }

})();
