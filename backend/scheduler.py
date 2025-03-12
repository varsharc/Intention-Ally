from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
import logging
from .brave_search import search_brave
from .storage import Storage
from .models import KeywordSearch

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SearchScheduler:

    def __init__(self, storage: Storage):
        self.storage = storage
        self.scheduler = AsyncIOScheduler()
        self.setup_jobs()
        logger.info("SearchScheduler initialized")

    def setup_jobs(self):
        # Schedule daily search at 10:45 UTC (4:15pm IST)
        self.scheduler.add_job(
            self.run_daily_searches,
            CronTrigger(hour=10, minute=45),
            id='daily_searches'
        )
        logger.info("Daily search job scheduled")

    async def run_daily_searches(self):
        logger.info("Starting daily search run")
        keywords = self.storage.get_keywords()
        logger.info(f"Found {len(keywords)} keywords to search")

        for keyword in keywords:
            if keyword.is_active:
                try:
                    logger.info(f"Searching for keyword: {keyword.value}")
                    results = await search_brave(keyword.value)
                    search = KeywordSearch(
                        keyword=keyword.value,
                        results=results,
                        timestamp=datetime.now()
                    )
                    self.storage.save_search_results(search)
                    logger.info(f"Successfully saved results for keyword: {keyword.value}")
                except Exception as e:
                    logger.error(f"Error searching for keyword {keyword.value}: {str(e)}")

    def start(self):
        self.scheduler.start()
        logger.info("Scheduler started")

    def shutdown(self):
        self.scheduler.shutdown()
        logger.info("Scheduler shutdown")