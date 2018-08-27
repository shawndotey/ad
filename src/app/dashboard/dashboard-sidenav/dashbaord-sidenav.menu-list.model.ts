import { MainMenu } from './dashboard-sidenav.service';
export const MENU_LIST: Partial<MainMenu>[] = [
  {
    name: 'Documentation',
    children: [
      {
        name: 'Angular',
        description: 'Nan',
        children: [
          {
            name: 'Core',
          },
          {
            name: 'Compiler',
          }
        ]
      },
      {
        name: 'Applications'
      }
    ]
  },
  {
    name: 'Examples',
    children: [
      {
        name: 'Angular',
        children: [
          {
            name: 'Core'
          },
          {
            name: 'Compiler'
          }
        ]
      },
      {
        name: 'Applications'
      }
    ]
  },
  {
    name: 'Home',
    route: './home'
  },
  {
    name: 'About',
    route: './about'
  },
];