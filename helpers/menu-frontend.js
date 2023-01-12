
const getMenuFrontEnd = ( role = 'USER_ROLE' ) => {

    const menu = [
        {
            titulo: 'Dashboard',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/' },
                { titulo: 'ProgressBar', url: '/dashboard/progress' },
                { titulo: 'Promesas', url: '/dashboard/promesas' },
                { titulo: 'Gráfica', url: '/dashboard/grafica1' },
                { titulo: 'Rxjs', url: '/dashboard/rxjs' },
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // { titulo: 'Usuarios', url: '/dashboard/usuarios' },
                { titulo: 'Hospitales', url: '/dashboard/hospitales' },
                { titulo: 'Médicos', url: '/dashboard/medicos' },
            ]
        }
    ];

    if( role === 'ADMIN_ROLE' ){
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/dashboard/usuarios' });
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}
