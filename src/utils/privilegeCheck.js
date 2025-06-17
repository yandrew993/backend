const hasAccess = (role, dataType) => {
    const roleAccessMap = {
      student: ['own_results', 'own_payments'],
      teacher: ['results', 'announcements'],
      admin: ['all'],
    };
  
    return roleAccessMap[role]?.includes(dataType) || roleAccessMap[role]?.includes('all');
  };

  export default hasAccess;