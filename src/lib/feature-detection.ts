
/**
 * Safely checks if a browser feature is available
 * Prevents "Unrecognized feature" console errors
 */
export const checkFeatureSupport = (featureName: string): boolean => {
  if (!window.navigator || !window.navigator.permissions) {
    return false;
  }
  
  try {
    // Use a safer approach than direct feature checking
    if (featureName === 'vr' || 
        featureName === 'ambient-light-sensor' || 
        featureName === 'battery') {
      return false;
    }
    
    return 'permissions' in navigator;
  } catch (error) {
    console.warn(`Feature check error: ${featureName}`, error);
    return false;
  }
};

/**
 * Returns a safe version of permissions.query that won't throw errors
 * for unsupported features
 */
export const safePermissionsQuery = async (featureName: string): Promise<{state: string}> => {
  if (!checkFeatureSupport(featureName)) {
    return { state: 'denied' };
  }
  
  try {
    return await navigator.permissions.query({ name: featureName as PermissionName });
  } catch (error) {
    console.warn(`Permission query error: ${featureName}`, error);
    return { state: 'denied' };
  }
};
