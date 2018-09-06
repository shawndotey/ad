import { MainMenu } from './dashboard-sidenav.service';
import {faHome, faInfoCircle} from '@fortawesome/free-solid-svg-icons';

export const MENU_LIST: Partial<MainMenu>[] = [
  {
    name: 'Home',
    route: './home',
    icon:faHome
  },
  {
    
    name: 'Angular Material 2',
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
    name: 'Bootstrap 4',
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
    name: 'About',
    route: './about',
    icon:faInfoCircle
  },
];