<!-- 
  Example Component using Improved Architecture
  This demonstrates how to use the new service layer and validation patterns
-->
<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6">Aircraft Configuration - Improved Architecture Demo</div>
      <div class="text-subtitle2">
        This demonstrates the improved architecture patterns
      </div>
    </q-card-section>

    <q-card-section>
      <!-- Aircraft Weight Information -->
      <div class="row q-gutter-md">
        <q-item class="col">
          <q-item-section>
            <q-item-label>Total Weight</q-item-label>
            <q-item-label caption>
              {{ formatWeight(aircraftWeights.total) }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="col">
          <q-item-section>
            <q-item-label>Takeoff Weight</q-item-label>
            <q-item-label caption>
              {{ formatWeight(aircraftWeights.takeoff) }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="col">
          <q-item-section>
            <q-item-label>Overweight</q-item-label>
            <q-badge :color="aircraftWeights.isOverweight ? 'negative' : 'positive'">
              {{ aircraftWeights.isOverweight ? 'YES' : 'NO' }}
            </q-badge>
          </q-item-section>
        </q-item>
      </div>

      <!-- Validated Input Examples -->
      <div class="row q-gutter-md q-mt-md">
        <q-input
          v-model.number="fuelQuantity"
          class="col"
          label="Fuel Quantity (%)"
          type="number"
          :rules="[fuelValidationRule]"
          @update:model-value="handleFuelChange"
        />

        <q-input
          v-model.number="ammoPercentage"
          class="col"
          label="Ammo Percentage (%)"
          type="number"
          :rules="[ammoValidationRule]"
          @update:model-value="handleAmmoChange"
        />
      </div>

      <!-- Configuration Management -->
      <div class="q-mt-md">
        <q-select
          v-model="selectedConfiguration"
          :options="availableConfigurations"
          option-label="name"
          option-value="name"
          label="Aircraft Configuration"
          @update:model-value="handleConfigurationChange"
        />
        
        <div class="row q-gutter-sm q-mt-sm">
          <q-btn 
            color="primary" 
            @click="saveCurrentConfiguration"
            :disable="!canSaveConfiguration"
          >
            Save Config
          </q-btn>
          
          <q-btn 
            color="negative" 
            @click="deleteConfiguration"
            :disable="!canDeleteConfiguration"
          >
            Delete Config
          </q-btn>
        </div>
      </div>

      <!-- Flight Phase Management (New Architecture) -->
      <div class="q-mt-md">
        <div class="text-h6">Flight Phases (Improved Architecture)</div>
        
        <div class="row q-gutter-sm">
          <q-btn
            v-for="phaseType in availablePhaseTypes"
            :key="phaseType"
            color="secondary"
            @click="addFlightPhase(phaseType)"
          >
            Add {{ getPhaseLabel(phaseType) }}
          </q-btn>
        </div>

        <q-list v-if="flightPhases.length > 0" class="q-mt-sm">
          <q-item v-for="(phase, index) in flightPhases" :key="index">
            <q-item-section>
              <q-item-label>{{ phase.label }}</q-item-label>
              <q-item-label caption>
                {{ phase.comment }} - 
                Fuel: {{ formatWeight(phase.fuelUsed) }} - 
                Distance: {{ phase.distance.toFixed(1) }} nm
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn 
                icon="delete" 
                flat 
                color="negative" 
                @click="removeFlightPhase(index)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useA10CStore } from 'src/stores/a10c';
import { useFlightStore } from 'src/stores/flight';
import { PhaseType, StoresConfiguration } from 'src/components/models';

// Service imports - demonstrates new architecture
import { WeightCalculationService } from 'src/service/weight-calculation.service';
import { ValidationService } from 'src/service/validation.service';
import { AircraftConfigurationService } from 'src/service/aircraft-configuration.service';

// Store instances
const aircraftStore = useA10CStore();
const flightStore = useFlightStore();

// Reactive data
const fuelQuantity = ref(aircraftStore.fuelQty);
const ammoPercentage = ref(aircraftStore.gunAmmoPercent);
const selectedConfiguration = ref<StoresConfiguration | null>(null);
const configurationName = ref('');

// Computed properties using services
const aircraftWeights = computed(() => ({
  total: aircraftStore.TotalWeight,
  takeoff: aircraftStore.TakeOffWeight,
  isOverweight: WeightCalculationService.isOverweight(aircraftStore.TotalWeight),
}));

const availableConfigurations = computed(() => 
  AircraftConfigurationService.getAvailableConfigurations()
);

const availablePhaseTypes = computed(() => 
  flightStore.NextImprovedPhases
);

const flightPhases = computed(() => 
  flightStore.improvedPhases
);

const canSaveConfiguration = computed(() => 
  ValidationService.isValidConfigurationName(configurationName.value)
);

const canDeleteConfiguration = computed(() => 
  selectedConfiguration.value && 
  selectedConfiguration.value.name !== 'Basic' && 
  selectedConfiguration.value.name !== 'Empty'
);

// Validation rules using ValidationService
const fuelValidationRule = (val: number) => 
  ValidationService.isValidPercentage(val) || 'Invalid fuel percentage';

const ammoValidationRule = (val: number) => 
  ValidationService.isValidPercentage(val) || 'Invalid ammo percentage';

// Event handlers
const handleFuelChange = (value: number) => {
  aircraftStore.setFuelQuantity(value);
};

const handleAmmoChange = (value: number) => {
  aircraftStore.setAmmoPercentage(value);
};

const handleConfigurationChange = (config: StoresConfiguration) => {
  try {
    aircraftStore.loadConfiguration(config);
    fuelQuantity.value = aircraftStore.fuelQty;
    ammoPercentage.value = aircraftStore.gunAmmoPercent;
  } catch (error) {
    console.error('Failed to load configuration:', error);
  }
};

const saveCurrentConfiguration = () => {
  try {
    aircraftStore.saveConfiguration(configurationName.value);
    configurationName.value = '';
  } catch (error) {
    console.error('Failed to save configuration:', error);
  }
};

const deleteConfiguration = () => {
  if (selectedConfiguration.value) {
    try {
      aircraftStore.deleteConfiguration(selectedConfiguration.value.name);
      selectedConfiguration.value = null;
    } catch (error) {
      console.error('Failed to delete configuration:', error);
    }
  }
};

const addFlightPhase = (phaseType: PhaseType) => {
  try {
    flightStore.addImprovedPhase(phaseType);
  } catch (error) {
    console.error('Failed to add flight phase:', error);
  }
};

const removeFlightPhase = (index: number) => {
  flightStore.improvedPhases.splice(index, 1);
};

// Utility functions
const formatWeight = (weight: number): string => {
  return `${weight.toFixed(0)} lbs`;
};

const getPhaseLabel = (phaseType: PhaseType): string => {
  const labels: Record<PhaseType, string> = {
    [PhaseType.TAKEOFF]: 'Takeoff',
    [PhaseType.CLIMB]: 'Climb',
    [PhaseType.CRUISE]: 'Cruise',
    [PhaseType.HI_COMBAT]: 'Combat',
    [PhaseType.DESCENT]: 'Descent',
    [PhaseType.LANDING]: 'Landing',
    [PhaseType.REFUEL]: 'Refuel',
  };
  return labels[phaseType] || 'Unknown';
};

// Watch for store changes to update local reactive data
watch(() => aircraftStore.fuelQty, (newVal) => {
  fuelQuantity.value = newVal;
});

watch(() => aircraftStore.gunAmmoPercent, (newVal) => {
  ammoPercentage.value = newVal;
});
</script>

<style scoped>
.my-card {
  margin: 16px;
}
</style>