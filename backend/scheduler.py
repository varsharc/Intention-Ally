from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
from .brave_search import search_brave
from .storage import Storage
from .models import KeywordSearch


class SearchScheduler:

    def __init__(self, storage: Storage):
        self.storage = storage
        self.scheduler = AsyncIOScheduler()
        self.setup_jobs()

    def setup_jobs(self):
        # Schedule daily search at 10:45 UTC (4:15pm IST)
        self.scheduler.add_job(self.run_daily_searches,
                               CronTrigger(hour=10, minute=45),
                               id='daily_searches')

    async def run_daily_searches(self):
        keywords = self.storage.get_keywords()
        for keyword in keywords:
            if keyword.is_active:
                try:
                    results = await search_brave(keyword.value)
                    search = KeywordSearch(keyword=keyword.value,
                                           results=results,
                                           timestamp=datetime.now())
                    self.storage.save_search_results(search)
                except Exception as e:
                    print(
                        f"Error searching for keyword {keyword.value}: {str(e)}"
                    )

    def start(self):
        self.scheduler.start()

    def shutdown(self):
        self.scheduler.shutdown()
