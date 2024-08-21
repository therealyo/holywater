# Holywater Project

## Overview

### Prerequisites

- **Node.js**: v16.x or higher
- **Docker**: Ensure Docker is installed to run services like PostgreSQL and DynamoDB locally
- **AWS CLI**: (Optional) If you want to interact with AWS services

### Installation

```bash
git clone https://github.com/your-repo/holywater.git
cd holywater
```

## Run Application

```bash
./scripts/start.sh
```

## Endpoints

### Queries

1. **Get Content Versions**
   Query Name: getContentVersions

Description: Retrieve a list of content versions by content ID with optional pagination.

Example Request:

```graphql
query GetContentVersions {
  getContentVersions(
    id: "87bc946f-3d01-405e-94a1-12567755d650"
    skip: 0
    limit: 2
  ) {
    version
    createdAt
  }
}
```

Arguments:

- id (String!): The ID of the content.
- skip (Int): Number of versions to skip (for pagination).
- limit (Int): Number of versions to return.

2. **Get Content by ID**
   Query Name: content

Description: Fetch a specific piece of content by ID and also optionaly by version.

Example Request:

```graphql
query Content {
  content(id: "aa4ca9ea-8e19-41c1-824a-7a63ca31cff5") {
    id
    title
    url
    version
    createdAt
    comments(limit: 1) {
      total
      items {
        userId
        text
        createdAt
      }
    }
  }
}
```

Arguments:

- id (String!): The ID of the content.
- version (Int, optional): The version of the content.

3. **Get Paginated Comments for Content**
   Field Name: comments

Description: Retrieve paginated comments for a specific piece of content.

Example Request:

```graphql
query Comments {
  comments(
    contentId: "aa4ca9ea-8e19-41c1-824a-7a63ca31cff5"
    limit: 1
    cursor: "2024-08-21T10:58:42.261Z"
  ) {
    items {
      id
      contentId
      userId
      text
      createdAt
    }
    total
    pageInfo {
      nextCursor
      hasNextPage
    }
  }
}
```

Arguments:

- contentId (String!): The ID of the content.
- limit (Int): Number of comments to return.
- cursor (String, optional): The cursor for pagination.

4. **Get Comments**
   Query Name: comments

Description: Retrieve paginated comments for a specific piece of content.

Example Request:

```graphql
query GetComments {
  comments(
    contentId: "aa4ca9ea-8e19-41c1-824a-7a63ca31cff5"
    limit: 1
    cursor: "2024-08-21T10:58:42.261Z"
  ) {
    items {
      id
      contentId
      userId
      text
      createdAt
    }
    total
    pageInfo {
      nextCursor
      hasNextPage
    }
  }
}
```

Arguments:

- contentId (String!): The ID of the content.
- limit (Int): Number of comments to return.
- cursor (String, optional): The cursor for pagination.

### Mutations

1. **Create Content**
   Mutation Name: createContent

Description: Create a new piece of content with an uploaded file.

Example Request:

```graphql
mutation CreateContent {
  createContent(createContentInput: { title: "My Content", content: Upload }) {
    id
    title
    url
    version
    createdAt
  }
}
```

Arguments:

- title (String!): The title of the content.
- content (Upload!): The file to be uploaded.

2. **Update Content**
   Mutation Name: updateContent

Description: Update existing content by creating a new version.

Example Request:

```graphql
mutation UpdateContent {
  updateContent(
    updateContentInput: {
      id: "87bc946f-3d01-405e-94a1-12567755d650"
      title: "Updated Title"
      content: Upload
    }
  ) {
    id
    title
    url
    version
    createdAt
  }
}
```

Arguments:

- id (String!): The ID of the content.
- title (String, optional): The new title of the content.
- content (Upload!): The new file to be uploaded.

3. **Reset Content to Specific Version**
   Mutation Name: resetToVersion

Description: Reset content to a specific version by creating a new version with the content from the specified version.

Example Request:

```graphql
mutation ResetToVersion {
  resetToVersion(
    resetContentInput: {
      id: "87bc946f-3d01-405e-94a1-12567755d650"
      version: 1
    }
  ) {
    id
    title
    url
    version
    createdAt
  }
}
```

Arguments:

- id (String!): The ID of the content.
- version (Int!): The version to reset to.

4. **Create Comment**
   Mutation Name: createComment

Description: Create a new comment for a specific piece of content. Requires authentication.

Example Request:

```graphql
mutation CreateComment {
  createComment(
    createCommentInput: {
      contentId: "aa4ca9ea-8e19-41c1-824a-7a63ca31cff5"
      text: "This is a test comment"
    }
  ) {
    id
    contentId
    userId
    text
    createdAt
  }
}
```

Arguments:

- createCommentInput (CreateCommentInput!): Input object containing contentId (String!) and text (String!).

## Postman Collection

https://www.postman.com/martian-water-866973/workspace/holywater/collection/22359005-b4fc29bc-5c83-4cd0-8acb-f3ce53bead7c

## Testing

To run the tests:

```
npm run test
```
