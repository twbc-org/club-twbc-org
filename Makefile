
PGDATABASE ?= tendenci
PGUSER ?= tendenci
EMAIL_HOST_USER ?= ray.finch@gmail.com
EMAIL_HOST_PASSWORD ?= 'zymx rsic qvwb jcaz'

# Generate secrets 
DJANGO_SETTINGS_SECRET ?= django_settings
PGPASSWORD ?= $(shell cat /dev/urandom | LC_ALL=C tr -dc '[:alpha:]'| fold -w 12 | head -n1)
SECRET_KEY ?= $(shell cat /dev/urandom | LC_ALL=C tr -dc '[:alpha:]'| fold -w 50 | head -n1)
SITE_SETTINGS_KEY ?= $(shell cat /dev/urandom | LC_ALL=C tr -dc '[:alpha:]'| fold -w 50 | head -n1)

INSTANCE_NAME ?= tendenci-db
INSTANCE_TYPE ?= db-f1-micro
PROJECT_ID ?= club-twbc-org
PROJECTNUM ?= $(shell gcloud projects describe $(PROJECT_ID) --format='value(projectNumber)')
REGION := us-west1
SERVICE_NAME ?= tendenci-service

INSTANCE_CONNECT_NAME := $(PROJECT_ID):$(REGION):$(INSTANCE_NAME)
PGHOST := /cloudsql/$(INSTANCE_CONNECT_NAME)
SERVICE_ACCOUNT := $(SERVICE_NAME)@$(PROJECT_ID).iam.gserviceaccount.com

.PHONY: init

django.env:
	@echo "To create $@ file, run 'make env > $@'"

env:
	@echo export PROJECT_ID=$(PROJECT_ID)
	@echo export PROJECTNUM=$(PROJECTNUM)
	@echo export INSTANCE_CONNECT_NAME=$(INSTANCE_CONNECT_NAME)
	@echo export PGDATABASE=$(PGDATABASE)
	@echo export PGHOST=$(PGHOST)
	@echo export PGPASSWORD=$(PGPASSWORD)
	@echo export PGUSER=$(PGUSER)
	@echo export SECRET_KEY=$(SECRET_KEY)
	@echo export SITE_SETTINGS_KEY=$(SITE_SETTINGS_KEY)
	@echo export EMAIL_HOST_USER=$(EMAIL_HOST_USER)
	@echo export EMAIL_HOST_PASSWORD=\'$(EMAIL_HOST_PASSWORD)\'

init: django.env
	@echo "# Run the following to initialize project"
	@echo gcloud auth application-default login
	@echo gcloud iam service-accounts create $(SERVICE_NAME)
	@echo gcloud sql instances create $(INSTANCE_NAME) \
    --project $(PROJECT_ID) \
    --database-version POSTGRES_13 \
    --tier $(INSTANCE_TYPE) \
    --region $(REGION)
	@echo gcloud sql databases create $(PGDATABASE) \
    --instance $(INSTANCE_NAME)
	@echo gcloud sql users create $(PGUSER) \
    --instance $(INSTANCE_NAME) \
    --password $(PGPASSWORD)
	@echo gcloud iam service-accounts create $(SERVICE_NAME)
	@echo gcloud secrets create django_settings --data-file django.env
	@echo cd club
	@echo python3 manage.py initial_migrate
	@echo python3 manage.py deploy
	@echo python3 manage.py collectstatic
	@echo python3 manage.py load_tendenci_defaults
	@echo python3 manage.py update_dashboard_stats
	@echo python3 manage.py rebuild_index --noinput

service_account:

# Cloud Run Invoker
grants:
	gcloud secrets add-iam-policy-binding $(DJANGO_SETTINGS_SECRET) \
    --member serviceAccount:$(PROJECTNUM)-compute@developer.gserviceaccount.com \
    --role roles/secretmanager.secretAccessor
	gcloud secrets add-iam-policy-binding $(DJANGO_SETTINGS_SECRET) \
    --member serviceAccount:$(PROJECTNUM)@cloudbuild.gserviceaccount.com \
    --role roles/secretmanager.secretAccessor
	gcloud projects add-iam-policy-binding $(PROJECT_ID) \
		--member serviceAccount:${SERVICE_ACCOUNT} \
		--role roles/run.invoker
	# Cloud SQL Client
	gcloud projects add-iam-policy-binding $(PROJECT_ID) \
		--member serviceAccount:${SERVICE_ACCOUNT} \
		--role roles/cloudsql.client
	# Storage Admin, on the media bucket
	echo gsutil iam ch \
    	serviceAccount:${SERVICE_ACCOUNT}:roles/storage.objectAdmin \
			gs://MEDIA_BUCKET
	# Secret Accessor, on the Django settings secret.
	gcloud secrets add-iam-policy-binding $(DJANGO_SETTINGS_SECRET) \
		--member serviceAccount:${SERVICE_ACCOUNT} \
		--role roles/secretmanager.secretAccessor

build:
	gcloud builds submit --config cloudmigrate.yaml \
    --substitutions _INSTANCE_NAME=$(INSTANCE_NAME),_REGION=$(REGION)

deploy:
	gcloud run deploy tendenci \
    --platform managed \
    --region $(REGION) \
    --image gcr.io/$(PROJECT_ID)/tendenci \
    --add-cloudsql-instances $(PROJECT_ID):$(REGION):$(INSTANCE_NAME) \
    --allow-unauthenticated

replace:
	gcloud run services replace service.yaml

update:
	gcloud run services update tendenci \
    --add-cloudsql-instances $(PROJECT_ID):$(REGION):$(INSTANCE_NAME)

run_proxy:
	cloud-sql-proxy --unix-socket /cloudsql/ $(INSTANCE_CONNECT_NAME)
