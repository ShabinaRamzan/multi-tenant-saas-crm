import logging
import sys


def setup_logging():
    """
    Poore app ke liye basic logging configure karta hai.
    Terminal mein clear, timestamped log messages dikhayega.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
    )

    # SQLAlchemy ki verbose logs kam karo (warna terminal spam ho jayega)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


        