export const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return `${month}/${day}/${year}`;
  };
  
  // Format date to Month Day, Year (e.g., January 1, 2023)
  export const formatDateLong = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format date with time (e.g., Jan 1, 2023, 3:30 PM)
  export const formatDateTime = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Get relative time (e.g., 5 minutes ago, 2 days ago)
  export const getRelativeTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    // Otherwise show date
    return formatDate(date);
  };
  
  // Check if date is today
  export const isToday = (date) => {
    if (!date) return false;
    
    const today = new Date();
    const checkDate = new Date(date);
    
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };
  
  // Check if date is within the last week
  export const isWithinLastWeek = (date) => {
    if (!date) return false;
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const checkDate = new Date(date);
    
    return checkDate >= oneWeekAgo;
  };
  
  // Parse string to date object
  export const parseDate = (dateString) => {
    if (!dateString) return null;
    
    // Try to parse the date
    const parsed = new Date(dateString);
    
    // Check if result is a valid date
    if (isNaN(parsed.getTime())) {
      return null;
    }
    
    return parsed;
  };
  