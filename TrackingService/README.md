# Tracking service

This readme clarifies the structure of this project.

### src folder
- **app.ts** Defines express app. Runs migrations and then server with Express app.
- **kafka_producer.ts** Contain logic for producing the messages to Kafka.
- **migration.ts** Contain function which migrates migrations defined in `src/migrations`.
- **test_setup.ts** Runs **migration.ts** before tests.

#### src/database
- **db_operations.ts** Contains a function to get a user with a user id from the MySql cluster.
- **db_source.ts** Contain an instance of a connection to the MySql cluster.

#### src/migrations
- **1659891872603_create_table_users.ts** First migration which creates table users.
- **1659891882442_add_users.ts** Second migration which populates table users with three users.

#### src/routes
- **common_routes_config.ts** Defines the base class for Express app endpoints.
- **users_routes_config.ts** Defines endpoints for our Express app.

#### src/types
- **user.ts** Defines interface User.

#### src/\_\_tests\_\_
- Contains unit and integration tests for migrations, Express app, Kafka producer, and database queries
