import { ISidebarMenu } from '../../interface/components/sidebar.interface'

export const CSideBarMenu: ISidebarMenu[] = [
    {
        name: 'Dashboard',
        path: '/pages/dashboard',
        childPath: ['/pages/dashboard'],
    },
    {
        name: 'CRUD',
        path: '/pages/students/list',
        childPath: [
            '/pages/students/list',
            '/pages/students/create',
            '/pages/students/update',
        ],
    },
    {
        name: 'Components',
        path: '/pages/components',
        childPath: ['/pages/components'],
        selectableChildPath: [
            { name: 'Alert', path: '/pages/components/alert' },
            { name: 'Avatar', path: '/pages/components/avatar' },
            { name: 'Badge', path: '/pages/components/badge' },
            { name: 'Button', path: '/pages/components/button' },
            { name: 'Card', path: '/pages/components/card' },
            { name: 'Text Input', path: '/pages/components/input' },
            { name: 'Select', path: '/pages/components/select' },
        ]
    },
    {
        name: 'Starter',
        path: '/pages/starter',
        childPath: ['/pages/starter']
    }
]
