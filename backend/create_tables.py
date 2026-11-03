from db.database import database_engine,DatabaseModelBase
import models
DatabaseModelBase.metadata.create_all(bind=database_engine)

print("Database tables Created Successfully")