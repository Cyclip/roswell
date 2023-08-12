export function timeDifference(isoDateString) {
    const date = new Date(isoDateString);
    const now = new Date();
    const timeDifference = now - date;
    const secondsDifference = Math.floor(timeDifference / 1000);
  
    if (secondsDifference < 10) {
      return "a moment ago";
    } else if (secondsDifference < 60) {
      return `${secondsDifference} seconds ago`;
    }
  
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    if (minutesDifference < 60) {
      return `${minutesDifference} ${minutesDifference === 1 ? "minute" : "minutes"} ago`;
    }
  
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    if (hoursDifference < 24) {
      return `${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"} ago`;
    }
  
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (daysDifference === 1) {
      return "yesterday";
    } else if (daysDifference < 30) {
      return `${daysDifference} days ago`;
    }
  
    const monthsDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
    if (monthsDifference < 12) {
      return `${monthsDifference} ${monthsDifference === 1 ? "month" : "months"} ago`;
    }
  
    const yearsDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
    return `${yearsDifference} ${yearsDifference === 1 ? "year" : "years"} ago`;
}

export const timeUntil = (date) => {
    const now = new Date();
    const timeDifference = date - now;
    const secondsDifference = Math.floor(timeDifference / 1000);
  
    if (secondsDifference < 10) {
      return "in a moment";
    } else if (secondsDifference < 60) {
      return `in ${secondsDifference} seconds`;
    }
  
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    if (minutesDifference < 60) {
      return `in ${minutesDifference} ${minutesDifference === 1 ? "minute" : "minutes"}`;
    }
  
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    if (hoursDifference < 24) {
      return `in ${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"}`;
    }
  
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (daysDifference === 1) {
      return "tomorrow";
    } else if (daysDifference < 30) {
      return `in ${daysDifference} days`;
    }
  
    const monthsDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
    if (monthsDifference < 12) {
      return `in ${monthsDifference} ${monthsDifference === 1 ? "month" : "months"}`;
    }
  
    const yearsDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
    return `in ${yearsDifference} ${yearsDifference === 1 ? "year" : "years"}`;
}