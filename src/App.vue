<script setup>
import {ref} from 'vue';
import {useToast} from "vuestic-ui";

const {notify} = useToast();

const uploadedFiles = ref([]);
const readyFiles = ref([]);

function onFileAdded(files) {
  // eslint-disable-next-line no-unused-vars
  for (let file of files) {
    uploadedFiles.value.pop();
  }

  for (let file of files) {
    if (uploadedFiles.value.findIndex((uploadedFile) => uploadedFile.name === file.name) >= 0) {
      notify({
        color: 'warning',
        message: `Файл с таким названием (${file.name}) уже был загружен.`,
      });
    } else {
      uploadedFiles.value.push(file);
    }
  }
}

async function onMigrate() {
  for (let file of uploadedFiles.value) {
    let weapon = await readFile(file);

    console.log(weapon);

    if (Object.hasOwn(weapon, 'Reference')) {
      notify({
        color: 'warning',
        message: `Файл ${file.name} уже имеет новый формат.`,
      });
      continue;
    }

    weapon['Reference'] = `weapon_${weapon['DefaultName']}`;
    delete weapon['DefaultName'];

    const removeFields = [
      'MaxWalkSpeed',
      'Damage',
      'Accuracy',
      'Price',
      'PrimaryAttackRate',
      'HasSecondaryAttack',
      'SecondaryAttackRate',
      'Abilities',
      'Hud',
    ];

    for (let field of removeFields) {
      if (Object.hasOwn(weapon, field)) {
        delete weapon[field];
      }
    }

    if (Object.hasOwn(weapon, 'ClipSize')) {
      weapon['MaxClip'] = weapon['ClipSize'];
      delete weapon['ClipSize'];
    }

    if (Object.hasOwn(weapon, 'Models')) {
      if (Object.hasOwn(weapon['Models'], 'v')) {
        weapon['Models']['View'] = weapon['Models']['v'];
        delete weapon['Models']['v'];
      }

      if (Object.hasOwn(weapon['Models'], 'p')) {
        weapon['Models']['Player'] = weapon['Models']['p'];
        delete weapon['Models']['p'];
      }

      if (Object.hasOwn(weapon['Models'], 'w')) {
        weapon['Models']['World'] = weapon['Models']['w'];
        delete weapon['Models']['w'];
      }
    }

    if (Object.hasOwn(weapon, 'Sounds')) {
      if (Object.hasOwn(weapon['Sounds'], 'ShotSilent')) {
        weapon['Sounds']['ShotSilenced'] = weapon['Sounds']['ShotSilent'];
        delete weapon['Sounds']['ShotSilent'];
      }
    }

    readyFiles.value.push({
      filename: file.name,
      content: JSON.stringify(weapon, null, '\t'),
    });
  }

  uploadedFiles.value = [];
}

function readFile(file) {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      resolve(JSON.parse(String(reader.result)));
    }
    reader.readAsText(file);
  });
}

// https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
</script>

<template>
  <VaLayout>
    <template #top>
      <VaNavbar>
        <template #center>
          <VaNavbarItem class="font-bold text-lg">
            CustomWeaponsAPI Weapons Migrator
          </VaNavbarItem>
        </template>
      </VaNavbar>
    </template>

    <template #content>
      <div class="m-auto container pt-4">
        <VaAlert color="warning">
          Все способности для старой версии не совместимы с новой и будут удалены из файла.
        </VaAlert>
        <VaAlert color="warning">
          Также, будут удалены все неподдерживаемые новой версией поля.
          Рекомендуется сохранять старые версии файлов, чтобы не потерять значения этих полей.
        </VaAlert>

        <div class="lg:w-1/2 m-auto mt-2">
          <VaCard>
            <VaCardTitle>Загрузка файлов (от версии 0.7.x)</VaCardTitle>
            <VaCardContent>
              <VaFileUpload
                  file-types="json"
                  v-model="uploadedFiles"
                  dropzone
                  upload-button-text="Выбрать файл"
                  drop-zone-text="Перетащите файл для загрузки"
                  @file-added="onFileAdded"
              />
            </VaCardContent>
            <VaCardActions>
              <VaButton class="w-full" @click="onMigrate">Конвертировать</VaButton>
            </VaCardActions>
          </VaCard>

          <VaDivider class="pt-3 pb-2 px-8"/>

          <VaCard>
            <VaCardTitle>Готовые файлы (для версии 0.8.0)</VaCardTitle>
            <VaCardContent>
              <VaList class="space-y-2">
                <VaListItem v-for="file in readyFiles" :key="file.filename">
                  <VaListItemSection class="text-lg">
                    {{ file.filename }}
                  </VaListItemSection>
                  <VaListItemSection>
                    <VaButton @click="download(file.filename, file.content)">Скачать</VaButton>
                  </VaListItemSection>
                </VaListItem>
              </VaList>
            </VaCardContent>
          </VaCard>
        </div>
      </div>
    </template>
  </VaLayout>
</template>
