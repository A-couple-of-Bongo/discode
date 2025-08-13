# 🤖 Discode

A Discord bot that brings LeetCode integration to your Discord server.

## Usage

### Initial Setup

If this is the first time you're adding the bot to your server, you'll want to run the setup commands:

1. **Set up notifications**: Run `/notify` to configure the notification system, create necessary roles, and set up the announcement channel
2. **Bind your account**: Use `/bind-user` to link your Discord account to your LeetCode username

### Available Commands

#### **Profile Commands**
- `/about-me` - Get your own LeetCode profile with detailed statistics
- `/about-you` - Get a member's LeetCode profile with detailed statistics
- `/user <leetcode_username>` - View any LeetCode user's profile and statistics
- `/bind-user <leetcode_username>` - Link your Discord account to a LeetCode profile

#### **Daily Challenges**
- `/daily-question get`: Fetch the daily question from Leetcode.
- `/daily-question my-solution`: Showcase your solution to the daily question
- `/daily-question your-solution <userid>`: View the solution to the daily question of a member
- `/notify` - Set up automatic daily notifications for your server

#### **Utility Commands**
- `/help` - Get comprehensive bot usage guidelines and command information
- `/ping` - Check if the bot is responsive and get server latency
