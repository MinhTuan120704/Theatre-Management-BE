/**
 * Role-based permission configuration
 * Defines what resources and actions each role can access
 */

export enum Role {
  CUSTOMER = "customer",
  EMPLOYEE = "employee",
  ADMIN = "admin",
}

export enum Permission {
  // User permissions
  READ_USERS = "read:users",
  CREATE_USERS = "create:users",
  UPDATE_USERS = "update:users",
  DELETE_USERS = "delete:users",
  UPDATE_OWN_PROFILE = "update:own_profile",

  // Movie permissions
  READ_MOVIES = "read:movies",
  CREATE_MOVIES = "create:movies",
  UPDATE_MOVIES = "update:movies",
  DELETE_MOVIES = "delete:movies",

  // Cinema permissions
  READ_CINEMAS = "read:cinemas",
  CREATE_CINEMAS = "create:cinemas",
  UPDATE_CINEMAS = "update:cinemas",
  DELETE_CINEMAS = "delete:cinemas",

  // Room permissions
  READ_ROOMS = "read:rooms",
  CREATE_ROOMS = "create:rooms",
  UPDATE_ROOMS = "update:rooms",
  DELETE_ROOMS = "delete:rooms",

  // Seat permissions
  READ_SEATS = "read:seats",
  CREATE_SEATS = "create:seats",
  UPDATE_SEATS = "update:seats",
  DELETE_SEATS = "delete:seats",

  // Showtime permissions
  READ_SHOWTIMES = "read:showtimes",
  CREATE_SHOWTIMES = "create:showtimes",
  UPDATE_SHOWTIMES = "update:showtimes",
  DELETE_SHOWTIMES = "delete:showtimes",

  // Order permissions
  READ_ORDERS = "read:orders",
  READ_OWN_ORDERS = "read:own_orders",
  CREATE_ORDERS = "create:orders",
  UPDATE_ORDERS = "update:orders",
  DELETE_ORDERS = "delete:orders",
  CANCEL_ORDERS = "cancel:orders",

  // Ticket permissions
  READ_TICKETS = "read:tickets",
  READ_OWN_TICKETS = "read:own_tickets",
  CREATE_TICKETS = "create:tickets",
  UPDATE_TICKETS = "update:tickets",
  DELETE_TICKETS = "delete:tickets",

  // Review permissions
  READ_REVIEWS = "read:reviews",
  CREATE_REVIEWS = "create:reviews",
  UPDATE_OWN_REVIEWS = "update:own_reviews",
  DELETE_OWN_REVIEWS = "delete:own_reviews",
  UPDATE_REVIEWS = "update:reviews",
  DELETE_REVIEWS = "delete:reviews",

  // Product permissions
  READ_PRODUCTS = "read:products",
  CREATE_PRODUCTS = "create:products",
  UPDATE_PRODUCTS = "update:products",
  DELETE_PRODUCTS = "delete:products",

  // Discount permissions
  READ_DISCOUNTS = "read:discounts",
  CREATE_DISCOUNTS = "create:discounts",
  UPDATE_DISCOUNTS = "update:discounts",
  DELETE_DISCOUNTS = "delete:discounts",
  APPLY_DISCOUNTS = "apply:discounts",

  // Employee permissions
  READ_EMPLOYEES = "read:employees",
  CREATE_EMPLOYEES = "create:employees",
  UPDATE_EMPLOYEES = "update:employees",
  DELETE_EMPLOYEES = "delete:employees",

  // Report and analytics
  VIEW_REPORTS = "view:reports",
  VIEW_ANALYTICS = "view:analytics",
}

/**
 * Permission mappings for each role
 */
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.CUSTOMER]: [
    // Own profile
    Permission.UPDATE_OWN_PROFILE,

    // Movies
    Permission.READ_MOVIES,

    // Cinemas
    Permission.READ_CINEMAS,

    // Rooms
    Permission.READ_ROOMS,

    // Seats
    Permission.READ_SEATS,

    // Showtimes
    Permission.READ_SHOWTIMES,

    // Orders
    Permission.READ_OWN_ORDERS,
    Permission.CREATE_ORDERS,
    Permission.CANCEL_ORDERS,

    // Tickets
    Permission.READ_OWN_TICKETS,

    // Reviews
    Permission.READ_REVIEWS,
    Permission.CREATE_REVIEWS,
    Permission.UPDATE_OWN_REVIEWS,
    Permission.DELETE_OWN_REVIEWS,

    // Products
    Permission.READ_PRODUCTS,

    // Discounts
    Permission.READ_DISCOUNTS,
    Permission.APPLY_DISCOUNTS,
  ],

  [Role.EMPLOYEE]: [
    // Own profile
    Permission.UPDATE_OWN_PROFILE,

    // Users (limited)
    Permission.READ_USERS,

    // Movies
    Permission.READ_MOVIES,
    Permission.CREATE_MOVIES,
    Permission.UPDATE_MOVIES,

    // Cinemas
    Permission.READ_CINEMAS,

    // Rooms
    Permission.READ_ROOMS,
    Permission.CREATE_ROOMS,
    Permission.UPDATE_ROOMS,

    // Seats
    Permission.READ_SEATS,
    Permission.CREATE_SEATS,
    Permission.UPDATE_SEATS,

    // Showtimes
    Permission.READ_SHOWTIMES,
    Permission.CREATE_SHOWTIMES,
    Permission.UPDATE_SHOWTIMES,

    // Orders
    Permission.READ_ORDERS,
    Permission.CREATE_ORDERS,
    Permission.UPDATE_ORDERS,

    // Tickets
    Permission.READ_TICKETS,
    Permission.CREATE_TICKETS,
    Permission.UPDATE_TICKETS,

    // Reviews
    Permission.READ_REVIEWS,
    Permission.UPDATE_REVIEWS,
    Permission.DELETE_REVIEWS,

    // Products
    Permission.READ_PRODUCTS,
    Permission.CREATE_PRODUCTS,
    Permission.UPDATE_PRODUCTS,

    // Discounts
    Permission.READ_DISCOUNTS,
    Permission.CREATE_DISCOUNTS,
    Permission.UPDATE_DISCOUNTS,
    Permission.APPLY_DISCOUNTS,

    // Employees
    Permission.READ_EMPLOYEES,
  ],

  [Role.ADMIN]: [
    // Full access to all permissions
    ...Object.values(Permission),
  ],
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role: Role, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) || false;
};

/**
 * Check if a role has any of the specified permissions
 */
export const hasAnyPermission = (
  role: Role,
  permissions: Permission[]
): boolean => {
  return permissions.some((permission) => hasPermission(role, permission));
};

/**
 * Check if a role has all of the specified permissions
 */
export const hasAllPermissions = (
  role: Role,
  permissions: Permission[]
): boolean => {
  return permissions.every((permission) => hasPermission(role, permission));
};

/**
 * Get all permissions for a role
 */
export const getPermissionsForRole = (role: Role): Permission[] => {
  return rolePermissions[role] || [];
};

/**
 * Resource-based permissions for easier route protection
 */
export const ResourcePermissions = {
  users: {
    read: Permission.READ_USERS,
    create: Permission.CREATE_USERS,
    update: Permission.UPDATE_USERS,
    delete: Permission.DELETE_USERS,
  },
  movies: {
    read: Permission.READ_MOVIES,
    create: Permission.CREATE_MOVIES,
    update: Permission.UPDATE_MOVIES,
    delete: Permission.DELETE_MOVIES,
  },
  cinemas: {
    read: Permission.READ_CINEMAS,
    create: Permission.CREATE_CINEMAS,
    update: Permission.UPDATE_CINEMAS,
    delete: Permission.DELETE_CINEMAS,
  },
  rooms: {
    read: Permission.READ_ROOMS,
    create: Permission.CREATE_ROOMS,
    update: Permission.UPDATE_ROOMS,
    delete: Permission.DELETE_ROOMS,
  },
  seats: {
    read: Permission.READ_SEATS,
    create: Permission.CREATE_SEATS,
    update: Permission.UPDATE_SEATS,
    delete: Permission.DELETE_SEATS,
  },
  showtimes: {
    read: Permission.READ_SHOWTIMES,
    create: Permission.CREATE_SHOWTIMES,
    update: Permission.UPDATE_SHOWTIMES,
    delete: Permission.DELETE_SHOWTIMES,
  },
  orders: {
    read: Permission.READ_ORDERS,
    readOwn: Permission.READ_OWN_ORDERS,
    create: Permission.CREATE_ORDERS,
    update: Permission.UPDATE_ORDERS,
    delete: Permission.DELETE_ORDERS,
    cancel: Permission.CANCEL_ORDERS,
  },
  tickets: {
    read: Permission.READ_TICKETS,
    readOwn: Permission.READ_OWN_TICKETS,
    create: Permission.CREATE_TICKETS,
    update: Permission.UPDATE_TICKETS,
    delete: Permission.DELETE_TICKETS,
  },
  reviews: {
    read: Permission.READ_REVIEWS,
    create: Permission.CREATE_REVIEWS,
    updateOwn: Permission.UPDATE_OWN_REVIEWS,
    deleteOwn: Permission.DELETE_OWN_REVIEWS,
    update: Permission.UPDATE_REVIEWS,
    delete: Permission.DELETE_REVIEWS,
  },
  products: {
    read: Permission.READ_PRODUCTS,
    create: Permission.CREATE_PRODUCTS,
    update: Permission.UPDATE_PRODUCTS,
    delete: Permission.DELETE_PRODUCTS,
  },
  discounts: {
    read: Permission.READ_DISCOUNTS,
    create: Permission.CREATE_DISCOUNTS,
    update: Permission.UPDATE_DISCOUNTS,
    delete: Permission.DELETE_DISCOUNTS,
    apply: Permission.APPLY_DISCOUNTS,
  },
  employees: {
    read: Permission.READ_EMPLOYEES,
    create: Permission.CREATE_EMPLOYEES,
    update: Permission.UPDATE_EMPLOYEES,
    delete: Permission.DELETE_EMPLOYEES,
  },
  reports: {
    view: Permission.VIEW_REPORTS,
  },
  analytics: {
    view: Permission.VIEW_ANALYTICS,
  },
};
