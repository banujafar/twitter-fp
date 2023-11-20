export const formattedDate = (postDate: Date) => {
    const now = new Date();
    const postCreatedDate = new Date(postDate);

    const timeDifference = now.getTime() - postCreatedDate.getTime();

    if (timeDifference < 60 * 1000) {
      return 'just now';
    } else if (timeDifference < 60 * 60 * 1000) {
      const minutesDifference = Math.floor(timeDifference / (60 * 1000));
      return `${minutesDifference}m`;
    } else if (timeDifference < 24 * 60 * 60 * 1000) {
      const hoursDifference = Math.floor(timeDifference / (60 * 60 * 1000));
      return `${hoursDifference}h`;
    } else if (timeDifference < 7 * 24 * 60 * 60 * 1000) {
      const daysDifference = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
      return `${daysDifference}d`;
    } else {
      const weeksDifference = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
      return `${weeksDifference}w`;
    }
  };