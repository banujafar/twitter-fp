import CreatePost from './CreatePost';
import PostsItem from './PostsItem';
import SearchBar from './SearchBar';

const PostsList = () => {
    //TODO:THIS DATA WILL RETRIEVE FROM SERVER
  const postsData=[
    {
      "fullname": "User1",
      "username": "@user1",
      "post": "Just had the most amazing coffee at #CoffeeHeaven! ☕️ #MorningFuel",
      "created_time": "1s",
    },
    {
      "fullname": "TechGeek123",
      "username": "@techgeek123",
      "post": "🚀 Just launched a new app! Check it out and let me know what you think: [AppLink]",
      "created_time": "4h",
    },
    {
      "fullname": "TravelExplorer",
      "username": "@travelexplorer",
      "post": "Just landed in Tokyo! 🇯🇵 Ready for a week of exploring and trying delicious food. #TravelDiaries",
      "created_time": "23h",
    },
    {
      "fullname": "FitnessFanatic",
      "username": "@fitnessfanatic",
      "post": "Crushed a new personal record at the gym today! 💪 Feeling stronger than ever. #FitnessGoals",
      "created_time": "3m",
    },
    {
      "fullname": "MovieBuff",
      "username": "@moviebuff",
      "post": "Movie night at home! 🎬 Watching [Movie Title]. What's your favorite movie of all time?",
      "created_time": "1h",
    },
    {
      "fullname": "FoodieAdventures",
      "username": "@foodieadventures",
      "post": "Tried a new restaurant in town tonight. The food was beyond amazing! 🍽️ #FoodieFinds",
      "created_time": "12s",
    },
    {
      "fullname": "BookWorm",
      "username": "@bookworm",
      "post": "Finished reading [Book Title]. Highly recommend it to all book lovers! 📚 #BookRecommendation",
      "created_time": "12m0",
    },
    {
      "fullname": "Fashionista",
      "username": "@fashionista",
      "post": "Obsessed with the latest fashion trends! 💃 Just bought a stunning dress from [FashionBrand]. #FashionFinds",
      "created_time": "21h",
    },
    {
      "fullname": "GamerZone",
      "username": "@gamerzone",
      "post": "Late-night gaming session! 🎮 Playing [Game Title]. What's your favorite game right now?",
      "created_time": "1h",
    },
    {
      "fullname": "InspirationHub",
      "username": "@inspirationhub",
      "post": "Embrace the challenges, they make you stronger. 💪 #MotivationMonday",
      "created_time": "21h",
    }
  ]
  const userData = {
    username: '@inspirationhub',
  };
  return (
    <div className='sm:max-w-[80%] md:min-w-[50%] lg:w-[50%] mx-2'>
        <div className='p-4 flex justify-between items-center'>
            <span>Home</span>
            <div className='xl:hidden sm:flex'>
            <SearchBar/>
            </div>
        </div>
       
        <CreatePost userData={userData}/>
      {postsData.map((posts, index) => (
        <PostsItem postData={posts} key={index} />
      ))}
    </div>
  );
};
export default PostsList
