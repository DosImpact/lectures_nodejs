from src.app.celery_app import celery_app


# Example task
@celery_app.task
def example_task(example_input):
    print("task income",example_input)
    return "This is an example"+example_input
