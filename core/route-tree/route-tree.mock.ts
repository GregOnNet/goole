import { Route } from '@angular/router';

export interface InspectedRoute extends Route {
    children?: InspectedRoute[];
    parent(): Route;
}

export const routeTreeData: any = () => [
  {
    'path': '',
    'redirectTo': 'welcome',
    'pathMatch': 'full',
    'data': {
      'fullPath': ''
    }
  },
  {
    'path': 'welcome',
    'data': {
      'fullPath': 'welcome',
      'title': 'Welcome',
      'iconCssClass': 'fa-home',
    }
  },
  {
    'path': 'help',
    'data': {
      'title': 'Help',
      'iconCssClass': 'fa-help',
      'fullPath': 'help'
    }
  },
  {
    'path': 'administration',
    'loadChildren': './administration/administration.module#AdministrationModule',
    'data': {
      'title': 'Administration',
      'fullPath': 'administration'
    },
    'children': [
      {
        'path': '',
        'redirectTo': 'dashboard',
        'pathMatch': 'full',
        'data': {
          'fullPath': 'administration'
        }
      },
      {
        'path': 'dashboard',
        'data': {
          'title': 'Dashboard',
          'fullPath': 'administration/dashboard'
        }
      },
      {
        'path': 'users',
        'data': {
          'title': 'Users',
          'fullPath': 'administration/users'
        }
      },
      {
        'path': 'confidential',
        'loadChildren': '../confidential/confidential.module#ConfidentialModule',
        'data': {
          'title': 'Confidential',
          'fullPath': 'administration/confidential'
        },
        'children': [
          {
            'path': '',
            'redirectTo': 'secret',
            'pathMatch': 'full',
            'data': {
              'fullPath': 'administration/confidential'
            }
          },
          {
            'path': 'secret',
            'data': {
              'fullPath': 'administration/confidential/secret'
            }
          }
        ]
      },
      {
        'path': 'user/:userID',
        'data': {
          'title': 'Users',
          'fullPath': 'administration/user/:userID'
        }
      }
    ]
  }
];
