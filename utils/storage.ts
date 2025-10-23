import AsyncStorage from '@react-native-async-storage/async-storage';

const FLOCKS_KEY = '@poultry_flocks';
const EXPENSES_KEY = '@poultry_expenses';
const RESOURCE_KEY = '@poultry_resource';
const ACTIVITY_KET = '@poultry_activity';
const USER_KEY = '@poultry_user';
const CURRENT_USER_KEY = '@poultry_currentUser';

interface Flocks {
  id: string;
  name: string;
  quantity?: string;
   type?: string ;
   weight?: string ;
   size?: string ;
   startDate?: string;
   notes?: string ;
  }
// Flock Management
export const saveFlocks = async (flocks: any) => {
  try {
    await AsyncStorage.setItem(FLOCKS_KEY, JSON.stringify(flocks));
    return true;
  } catch (error) {
    console.error('Error saving flocks:', error);
    return false;
  }
};

export const saveActivities = async (activities: any) => {
  try {
    await AsyncStorage.setItem(ACTIVITY_KET, JSON.stringify(activities));
    return true;
  } catch (error) {
    console.error('Error saving flocks:', error);
    return false;
  }
};

export const saveResource = async (resource: any) => {
  try {
    await AsyncStorage.setItem(RESOURCE_KEY, JSON.stringify(resource));
    return true;
  } catch (error) {
    console.error('Error saving flocks:', error);
    return false;
  }
};

export const getFlock = async (id: any) => {
  try{
 const flocks = await AsyncStorage.getItem(FLOCKS_KEY)
 const flock = flocks ? JSON.parse(flocks) : []
 const result = flock.find((Object: { 
  id: string;
  name: string;
  quantity?: string;
   type?: string ;
   weight?: string ;
   size?: string ;
   startDate?: string;
   notes?: string ;}) => Object.id === id) || null;

   return result
} catch (error) {
    console.error('Error getting flocks:', error);
    return [];
  }
}


export const getActivity = async (id: any) => {

  try{
 const activities = await AsyncStorage.getItem(ACTIVITY_KET)
 const activity = activities ? JSON.parse(activities) : []
 const result = activity.find((Object: { 
  id: string;
  totalWeight: string;
  feedConsumed: string;
  died: string ;
  date: string;
  flockId: string ;}) => Object.id === id) || null;

   return result
} catch (error) {
    console.error('Error getting flocks:', error);
    return [];
  }
}


export const getResource = async (id: any) => {
  try{
 const resources = await AsyncStorage.getItem(RESOURCE_KEY)
 const resourcesParsed = resources ? JSON.parse(resources) : []
 const result = resourcesParsed.find((Object: { 
  id: string;
  name: string;
  description: string;
  category: string ;
  date?: string;
  }) => Object.id === id) || null;

   return result
} catch (error) {
    console.error('Error getting Resources:', error);
    return [];
  }
}

export const getResources = async () => {
  try {
    const resources = await AsyncStorage.getItem(RESOURCE_KEY);
    return resources ? JSON.parse(resources) : [];
  } catch (error) {
    console.error('Error getting resource:', error);
    return [];
  }
};

export const getExpense = async (id: any) => {
  try{
 const flocks = await AsyncStorage.getItem(EXPENSES_KEY)
 const flock = flocks ? JSON.parse(flocks) : []
 const result = flock.find((Object: { 
  id: string;
  flock: string;
  category: string;
  amount: string;
  date: string;
  description: string;}) => Object.id === id) || null;

   return result
} catch (error) {
    console.error('Error getting flocks:', error);
    return [];
  }
}

export const getFlocks = async () => {
  try {
    const flocks = await AsyncStorage.getItem(FLOCKS_KEY);
    return flocks ? JSON.parse(flocks) : [];
  } catch (error) {
    console.error('Error getting flocks:', error);
    return [];
  }
};

export const getActivities = async () => {
  try {
    const activities = await AsyncStorage.getItem(ACTIVITY_KET);
    return activities ? JSON.parse(activities) : [];
  } catch (error) {
    console.error('Error getting activities:', error);
    return [];
  }
};

export const getUsers = async () => {
  try {
    const users = await AsyncStorage.getItem(USER_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const addUsers = async (user: any) => {
  try {
    const users = await getUsers();
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    await saveUsers(users);
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error);
    return null;
  }
};

export const saveUsers = async (users: any) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};

export const saveCurrentUser = async (users: any) => {
   try {
    const result = await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users));
     return result;
   } catch (error) {
     console.error('Error saving current user:', error);
     return false;
   }
 };

 export const getCurrentUser = async () => {
   try{
  const users = await AsyncStorage.getItem(CURRENT_USER_KEY)
  const user = users ? JSON.parse(users) : []
 
    return user
 } catch (error) {
     console.error('Error getting users:', error);
     return [];
   }
 }

export const getUser = async (email: string, password: string) => {
  try{
 const users = await AsyncStorage.getItem(USER_KEY)
 const user = users ? JSON.parse(users) : []
 const result = user.find((Object: { 
  id: string;
  name: string;
  companyName: string;
  email: string;
  password: string
  }) => Object.email === email && Object.password === password) || null;
   return result
} catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

export const addResource = async (resource: any) => {
  try {
    const resources = await getResources();
    const newResource = {
      ...resource,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    resources.push(newResource);
    await saveResource(resources);
    return newResource;
  } catch (error) {
    console.error('Error adding flock:', error);
    return null;
  }
};

export const addActivity = async (activity: any) => {
  try {
    const activies = await getActivities();
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    activies.push(newActivity);
    await saveActivities(activies)
    return newActivity;
  } catch (error) {
    console.error('Error adding flock:', error);
    return null;
  }
};

export const updateResource = async (id: string | string[], updatedData: any) => {
  try {
    const flocks = await getResources();
    const index = flocks.findIndex((f: { id: string; }) => f.id === id);
    if (index !== -1) {
      flocks[index] = { ...flocks[index], ...updatedData };
      await saveResource(flocks);
      return flocks[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating flock:', error);
    return null;
  }
};

export const updateActivity = async (id: string | string[], updatedData: any) => {
  try {
    const activities = await getActivities();
    const index = activities.findIndex((f: { id: string; }) => f.id === id);
    if (index !== -1) {
      activities[index] = { ...activities[index], ...updatedData };
      await saveActivities(activities);
      return activities[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating activity:', error);
    return null;
  }
};

export const addFlock = async (flock: any) => {
  try {
    const flocks = await getFlocks();
    const newFlock = {
      ...flock,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    flocks.push(newFlock);
    await saveFlocks(flocks);
    return newFlock;
  } catch (error) {
    console.error('Error adding flock:', error);
    return null;
  }
};

export const updateFlock = async (id: string | string[], updatedData: any) => {
  try {
    const flocks = await getFlocks();
    const index = flocks.findIndex((f: { id: string; }) => f.id === id);
    if (index !== -1) {
      flocks[index] = { ...flocks[index], ...updatedData };
      await saveFlocks(flocks);
      return flocks[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating flock:', error);
    return null;
  }
};

export const deleteFlock = async (id: string) => {
  try {
    const flocks = await getFlocks();
    const filtered = flocks.filter((f: { id: string; }) => f.id !== id);
    await saveFlocks(filtered);
    // Also delete related expenses
    const expenses = await getExpenses();
    const filteredExpenses = expenses.filter((e: { flockId: string; }) => e.flockId !== id);
    await saveExpenses(filteredExpenses);
    return true;
  } catch (error) {
    console.error('Error deleting flock:', error);
    return false;
  }
};
export const deleteResource = async (id: string) => {
  try {
    const resources = await getResources();
    const filtered = resources.filter((f: { id: string; }) => f.id !== id);
    await saveResource(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting flock:', error);
    return false;
  }
};
// Expense Management
export const saveExpenses = async (expenses: any) => {
  try {
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    return true;
  } catch (error) {
    console.error('Error saving expenses:', error);
    return false;
  }
};

export const getExpenses = async () => {
  try {
    const expenses = await AsyncStorage.getItem(EXPENSES_KEY);
    return expenses ? JSON.parse(expenses) : [];
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

export const addExpense = async (expense: any) => {
  try {
    const expenses = await getExpenses();
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    expenses.push(newExpense);
    await saveExpenses(expenses);
    return newExpense;
  } catch (error) {
    console.error('Error adding expense:', error);
    return null;
  }
};

export const updateExpense = async (id: string | string[], updatedData: any) => {
  try {
    const expenses = await getExpenses();
    const index = expenses.findIndex((e: { id: string; }) => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updatedData };
      await saveExpenses(expenses);
      return expenses[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating expense:', error);
    return null;
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const expenses = await getExpenses();
    const filtered = expenses.filter((e: { id: string; }) => e.id !== id);
    await saveExpenses(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
};

export const deleteActivity = async (id: string) => {
  try {
    const Activities = await getActivities();
    const filtered = Activities.filter((e: { id: string; }) => e.id !== id);
    await saveActivities(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
};

export const getExpensesByFlock = async (itemId: string | string[]) => {
  try {
    const expenses = await getExpenses();
    return expenses.filter((e: { flockId: string; }) => e.flockId === itemId);
  } catch (error) {
    console.error('Error getting expenses by flock:', error);
    return [];
  }
};
